import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'category'],
  },
  fields: [
    {
      name: 'title',
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
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Innerwear', value: 'innerwear' },
        { label: 'Lounge', value: 'lounge' },
        { label: 'Activewear', value: 'activewear' },
        { label: 'Accessories', value: 'accessories' },
      ],
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      required: true,
      hasMany: true,
    },
    {
      name: 'variants',
      type: 'array',
      label: 'Product Variants',
      fields: [
        {
          name: 'color',
          type: 'text',
          label: 'Color (Hex code)',
          required: true,
        },
        {
          name: 'size',
          type: 'select',
          required: true,
          options: [
            { label: 'S', value: 'S' },
            { label: 'M', value: 'M' },
            { label: 'L', value: 'L' },
            { label: 'XL', value: 'XL' },
          ],
        },
        {
          name: 'inventory',
          type: 'number',
          label: 'Inventory Count',
          required: true,
          defaultValue: 0,
        },
      ],
    },
  ],
}
