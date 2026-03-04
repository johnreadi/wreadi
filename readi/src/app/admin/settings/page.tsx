import { getAppearanceSettings } from "./settings-actions";
import { getMenuItems, getTopBarItems } from "./menu-actions";
import { AppearanceForm } from "./AppearanceForm";
import { SecurityForms } from "./SecurityForms";
import { SmtpSettingsForm } from "./SmtpSettingsForm";

export default async function AdminSettingsPage() {
    const settings = await getAppearanceSettings();
    const menuItems = await getMenuItems();
    const topBarItems = await getTopBarItems();

    return (
        <div className="space-y-12">
            {/* Nouvelle section :Identité & Apparence */}
            <AppearanceForm 
                initialSettings={settings} 
                menuItems={menuItems}
                topBarItems={topBarItems}
            />

            {/* Configuration SMTP */}
            <SmtpSettingsForm initialSettings={settings} />

            {/* Section existante : Sécurité & Profil */}
            <SecurityForms />
        </div>
    );
}
