import OMRTemplate from '@/components/OMRTemplate';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TemplatePage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main>
      <OMRTemplate examId={id}/>
    </main>
  );
}