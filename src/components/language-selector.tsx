
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: t('language.en') },
    { code: 'it', name: t('language.it') },
    { code: 'fr', name: t('language.fr') },
    { code: 'de', name: t('language.de') },
    { code: 'es', name: t('language.es') },
    { code: 'pt', name: t('language.pt') },
    { code: 'zh', name: t('language.zh') },
  ];

  return (
    <Select
      value={i18n.language}
      onValueChange={(value) => i18n.changeLanguage(value)}
    >
      <SelectTrigger className="w-[140px]">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <SelectValue placeholder={t('language.label')} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
