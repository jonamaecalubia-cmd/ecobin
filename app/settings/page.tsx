import EcobinLayout from "../../components/EcobinLayout";
import SettingsForm from "@/components/SettingsForm";

export default function SettingsPage() {
  return (
    <EcobinLayout
      title="Settings"
      subtitle="Configure ECOBIN monitoring and notification preferences"
    >
      <SettingsForm />
    </EcobinLayout>
  );
}