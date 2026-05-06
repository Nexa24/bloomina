import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'categories'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'categories',
      type: 'json', // Using JSON to support the array of strings in DB
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Draft', value: 'Draft' },
      ],
      defaultValue: 'Active',
    },
    {
      name: 'images',
      type: 'json', // Using JSON to support the array of URLs in DB
      required: true,
    },
    {
      name: 'colorConfigs',
      type: 'json', // Using JSON to match the existing JSONB column in DB
    },
    {
      name: 'variants',
      type: 'json', // Using JSON to match the existing JSONB column in DB
    },
    {
      name: 'specifications',
      type: 'json',
    },
    {
      name: 'stock',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'sku',
      type: 'text',
    },
    {
      name: 'barcode',
      type: 'text',
    },
    {
      name: 'trackQuantity',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'is_sale',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'comparePrice',
      type: 'number',
    },
    {
      name: 'cost',
      type: 'number',
    },
    {
      name: 'supplierRef',
      type: 'text',
    },
    {
      name: 'material_id',
      type: 'text',
    },
    {
      name: 'size_guide_id',
      type: 'text',
    },
  ],
}
