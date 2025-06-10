export function getCountryFromLocale() {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale; // e.g., "en-US"
    const parts = locale.split('-');
    if (parts.length === 2) {
        return parts[1].toUpperCase(); // "US"
    }
    return null;
}