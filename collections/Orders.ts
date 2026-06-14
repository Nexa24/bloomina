import { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'customer_name', 'total', 'status'],
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false, // Allow guest checkout
    },
    {
      name: 'customer_name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'items',
      type: 'json', // Using JSON to match the dashboard's expectation
      required: true,
    },
    {
      name: 'total',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'Payment Pending',
      options: [
        { label: 'Payment Pending', value: 'Payment Pending' },
        { label: 'Payment Done', value: 'Payment Done' },
        { label: 'Processing', value: 'Processing' },
        { label: 'Shipped', value: 'Shipped' },
        { label: 'Delivered', value: 'Delivered' },
        { label: 'Cancelled', value: 'Cancelled' },
      ],
    },
    {
      name: 'shipping_address',
      type: 'json', // Match the nested object structure
    },
    {
      name: 'payment_method',
      type: 'text',
      defaultValue: 'Razorpay',
    },
    {
      name: 'razorpay_order_id',
      type: 'text',
    },
    {
      name: 'razorpay_payment_id',
      type: 'text',
    },
    {
      name: 'razorpay_signature',
      type: 'text',
    },
    {
      name: 'metadata',
      type: 'json',
    },
    {
      name: 'delivery_method',
      type: 'text',
    },
    {
      name: 'tracking_number',
      type: 'text',
    }
  ],
}
