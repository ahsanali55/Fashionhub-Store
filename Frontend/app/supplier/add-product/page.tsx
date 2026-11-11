import { redirect } from 'next/navigation';

export default function LegacySupplierAddProductRoute() {
  redirect('/supplier/products/add');
}
