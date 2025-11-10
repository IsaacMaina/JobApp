import ApplicationForm from '@/components/pageComponents/ApplicationForm';

export default async function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ✅ unwrap promise

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Apply for Job</h1>
      <ApplicationForm jobId={id} />
    </div>
  );
}
