import { Router } from 'express';
import { protect } from '../middlewares/auth.js';
import Lead from '../models/Lead.js';
import Consultant from '../models/Consultant.js';
import Inventory from '../models/Inventory.js';
import { sendLeadAssignmentEmail } from '../config/mailer.js';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Backend API is running smoothly',
    timestamp: new Date()
  });
});

// ==========================================
// CONSULTANTS ROUTES (Protected)
// ==========================================

// Get all consultants
router.get('/consultants', protect, async (req, res) => {
  try {
    const consultants = await Consultant.find({}).sort({ name: 1 });
    res.json(consultants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching consultants' });
  }
});

// Add a consultant
router.post('/consultants', protect, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Please provide name, email, and phone' });
    }

    const consultant = await Consultant.create({ name, email, phone });
    res.status(201).json(consultant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating consultant' });
  }
});

// Update a consultant profile
router.put('/consultants/:id', protect, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const consultantId = req.params.id;

    const consultant = await Consultant.findById(consultantId);
    if (!consultant) {
      return res.status(404).json({ error: 'Consultant not found' });
    }

    const updatedConsultant = await Consultant.findByIdAndUpdate(
      consultantId,
      {
        name: name !== undefined ? name : consultant.name,
        email: email !== undefined ? email : consultant.email,
        phone: phone !== undefined ? phone : consultant.phone
      },
      { new: true }
    );

    res.json(updatedConsultant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating consultant' });
  }
});

// Delete a consultant
router.delete('/consultants/:id', protect, async (req, res) => {
  try {
    const consultantId = req.params.id;

    const consultant = await Consultant.findById(consultantId);
    if (!consultant) {
      return res.status(404).json({ error: 'Consultant not found' });
    }

    await Consultant.findByIdAndDelete(consultantId);

    // Clean up leads assigned to this consultant
    await Lead.updateMany(
      { consultant: consultantId },
      { $set: { consultant: null, status: 'New' } }
    );

    res.json({ success: true, message: 'Consultant deleted successfully and assigned leads reset.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting consultant' });
  }
});

// ==========================================
// LEADS ROUTES
// ==========================================

// Public lead submission endpoint (from Shopify custom form)
router.post('/leads', async (req, res) => {
  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON payload in request body string' });
      }
    }

    const { name, email, phone, whatsapp, dob, tob, pob, location, occupation, concern, message, shopifyData } = body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required to submit a lead' });
    }

    const lead = await Lead.create({
      name,
      email,
      phone: phone || '',
      whatsapp: whatsapp || '',
      dob: dob || '',
      tob: tob || '',
      pob: pob || '',
      location: location || '',
      occupation: occupation || '',
      concern: concern || '',
      message: message || '',
      shopifyData: shopifyData || {},
      status: 'New'
    });

    res.status(201).json({
      success: true,
      message: 'Lead submitted successfully',
      leadId: lead._id
    });
  } catch (error) {
    console.error('Error submitting lead:', error);
    res.status(500).json({ error: 'Server error submitting lead' });
  }
});

// Protected: Get all leads for the dashboard
router.get('/leads', protect, async (req, res) => {
  try {
    const leads = await Lead.find({})
      .populate('consultant', 'name email phone')
      .populate('convertedProduct', 'name sku price')
      .sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching leads' });
  }
});

// Protected: Assign or update consultant for a lead
router.put('/leads/:id/assign', protect, async (req, res) => {
  try {
    const { consultantId } = req.body;
    const leadId = req.params.id;

    // consultantId can be null if unassigning
    if (consultantId) {
      const consultantExists = await Consultant.findById(consultantId);
      if (!consultantExists) {
        return res.status(404).json({ error: 'Consultant not found' });
      }
    }

    const lead = await Lead.findByIdAndUpdate(
      leadId,
      { 
        consultant: consultantId || null,
        status: consultantId ? 'Contacted' : 'New' // Auto-update status if assigned
      },
      { new: true }
    ).populate('consultant', 'name email phone');

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Trigger automatic assignment email notification
    if (lead.consultant && lead.consultant.email) {
      sendLeadAssignmentEmail(lead.consultant, lead);
    }

    res.json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error assigning consultant' });
  }
});

// Protected: Update lead status
router.put('/leads/:id/status', protect, async (req, res) => {
  try {
    const { status, convertedProductId } = req.body;
    if (!['New', 'Contacted', 'Converted', 'Lost'].includes(status)) {
      return res.status(400).json({ error: 'Invalid lead status value' });
    }

    const updateFields = { status };
    if (status === 'Converted') {
      updateFields.convertedProduct = convertedProductId || null;
    } else {
      updateFields.convertedProduct = null;
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    )
    .populate('consultant', 'name email phone')
    .populate('convertedProduct', 'name sku price');

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating lead status' });
  }
});

// ==========================================
// INVENTORY ROUTES (Protected)
// ==========================================

// Get all inventory items
router.get('/inventory', protect, async (req, res) => {
  try {
    const inventory = await Inventory.find({}).sort({ createdAt: -1 });
    res.json(inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching inventory' });
  }
});

// Add an inventory item
router.post('/inventory', protect, async (req, res) => {
  try {
    const { name, sku, price, quantity, description, category } = req.body;

    if (!name || !sku || price === undefined || quantity === undefined) {
      return res.status(400).json({ error: 'Name, SKU, Price, and Quantity are required' });
    }

    // Check if SKU already exists
    const skuExists = await Inventory.findOne({ sku });
    if (skuExists) {
      return res.status(400).json({ error: 'An item with this SKU already exists' });
    }

    const item = await Inventory.create({
      name,
      sku,
      price,
      quantity,
      description: description || '',
      category: category || 'General'
    });

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating inventory item' });
  }
});

// Update an inventory item
router.put('/inventory/:id', protect, async (req, res) => {
  try {
    const { name, sku, price, quantity, description, category } = req.body;
    const itemId = req.params.id;

    const item = await Inventory.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    // If changing SKU, check if new SKU is already in use
    if (sku && sku !== item.sku) {
      const skuExists = await Inventory.findOne({ sku });
      if (skuExists) {
        return res.status(400).json({ error: 'An item with this SKU already exists' });
      }
    }

    const updatedItem = await Inventory.findByIdAndUpdate(
      itemId,
      {
        name: name !== undefined ? name : item.name,
        sku: sku !== undefined ? sku : item.sku,
        price: price !== undefined ? price : item.price,
        quantity: quantity !== undefined ? quantity : item.quantity,
        description: description !== undefined ? description : item.description,
        category: category !== undefined ? category : item.category
      },
      { new: true }
    );

    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating inventory item' });
  }
});

// Delete an inventory item
router.delete('/inventory/:id', protect, async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting inventory item' });
  }
});

// ==========================================
// SHOPIFY WEBHOOKS
// ==========================================

// Public Webhook receiver for Shopify product events (Create, Update, Delete)
router.post('/webhooks/shopify/products', async (req, res) => {
  try {
    const topic = req.headers['x-shopify-topic'];
    const product = req.body;

    console.log(`Received Shopify product webhook. Topic: ${topic}, Product ID: ${product.id}`);

    if (topic === 'products/delete') {
      // Delete all variants associated with this product ID
      const result = await Inventory.deleteMany({ shopifyProductId: String(product.id) });
      console.log(`Deleted ${result.deletedCount} inventory items for Shopify Product ID ${product.id}`);
      return res.status(200).json({ success: true, message: 'Products deleted' });
    }

    if (topic === 'products/create' || topic === 'products/update') {
      const variants = product.variants || [];
      
      for (const variant of variants) {
        // Generate fallback SKU if none is set
        const variantSku = variant.sku ? variant.sku.trim() : `SHPFY-${variant.id}`;
        
        // Find existing item by Variant ID or SKU
        let item = await Inventory.findOne({
          $or: [
            { shopifyVariantId: String(variant.id) },
            { sku: variantSku }
          ]
        });

        const name = product.title + (variant.title && variant.title !== 'Default Title' ? ` - ${variant.title}` : '');
        const price = Number(variant.price) || 0;
        const quantity = variant.inventory_quantity !== undefined ? Number(variant.inventory_quantity) : 0;
        const description = product.body_html ? product.body_html.replace(/<\/?[^>]+(>|$)/g, "") : ''; // Strip HTML tags
        const category = product.product_type || 'General';

        if (item) {
          // Update existing item
          item.name = name;
          item.sku = variantSku;
          item.price = price;
          item.quantity = quantity;
          item.description = description;
          item.category = category;
          item.shopifyProductId = String(product.id);
          item.shopifyVariantId = String(variant.id);
          await item.save();
          console.log(`Updated inventory item: ${name} (SKU: ${variantSku})`);
        } else {
          // Create new item
          await Inventory.create({
            name,
            sku: variantSku,
            price,
            quantity,
            description,
            category,
            shopifyProductId: String(product.id),
            shopifyVariantId: String(variant.id)
          });
          console.log(`Created new inventory item from Shopify: ${name} (SKU: ${variantSku})`);
        }
      }

      return res.status(200).json({ success: true, message: 'Products created/updated' });
    }

    res.status(400).json({ error: 'Unsupported webhook topic' });
  } catch (error) {
    console.error('Shopify Product Webhook Error:', error);
    res.status(500).json({ error: 'Server error processing webhook' });
  }
});

export default router;
