// app/[locale]/page.tsx
export default function LocaleHome({
  params,
}: {
  params: { locale: 'en' | 'ar' };
}) {
  const { locale } = params;

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>
        {locale === 'ar' ? 'مرحبا بكم في Aurify1225' : 'Welcome to Aurify1225'}
      </h1>
      <p>
        {locale === 'ar'
          ? 'هذا هو الصفحة الرئيسية المحلية.'
          : 'This is the localized home page.'}
      </p>
      <p>
        Locale: <b>{locale}</b>
      </p>
      <nav style={{ marginTop: 16 }}>
        <a href="/en" style={{ marginRight: 16 }}>
          English
        </a>
        <a href="/ar">العربية</a>
      </nav>
    </main>
  );
}
