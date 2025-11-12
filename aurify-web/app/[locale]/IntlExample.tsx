export default function IntlExample({ locale }: { locale: string }) {
  const now = new Date();
  const dateLocale = locale === 'ar' ? 'ar-AE' : 'en-AE';
  const formattedDate = new Intl.DateTimeFormat(dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(now);

  const formattedCurrency = new Intl.NumberFormat(dateLocale, {
    style: 'currency',
    currency: 'AED',
  }).format(1234.56);

  return (
    <section style={{ marginTop: 16 }}>
      <h2 style={{ marginBottom: 8 }}>{locale === 'ar' ? 'مثال تنسيق' : 'Formatting example'}</h2>
      <p>
        {locale === 'ar' ? 'التاريخ:' : 'Date:'} <strong>{formattedDate}</strong>
      </p>
      <p>
        {locale === 'ar' ? 'السعر:' : 'Price:'} <strong>{formattedCurrency}</strong>
      </p>
    </section>
  );
}
