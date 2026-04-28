import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Bardage bois — DIY Builder',
  robots: { index: false },
};

export default function BardagePage() {
  redirect('/');
}
