import ContactDetailClient from "./ContactDetailClient";

export default async function Page({ params }) {
  const resolved = await params;   // ✅ unwrap the Promise
  return <ContactDetailClient id={resolved.id} />;
}
