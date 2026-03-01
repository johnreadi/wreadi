import { getAppearanceSettings } from "./settings-actions";
import { AppearanceForm } from "./AppearanceForm";
import { SecurityForms } from "./SecurityForms";

export default async function AdminSettingsPage() {
    const settings = await getAppearanceSettings();

    return (
        <div className="space-y-12">
            {/* Nouvelle section :Identité & Apparence */}
            <AppearanceForm initialSettings={settings} />

            {/* Section existante : Sécurité & Profil */}
            <SecurityForms />
        </div>
    );
}
