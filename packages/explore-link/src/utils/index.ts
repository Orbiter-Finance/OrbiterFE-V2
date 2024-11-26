export function sortUrls(urls: string[], priorities: string[]): string[] {
    return urls.sort((a, b) => {
        const aPriority = priorities.some(priority => a.includes(priority));
        const bPriority = priorities.some(priority => b.includes(priority));
        if (aPriority && !bPriority) return -1;
        if (!aPriority && bPriority) return 1;
        return 0;
    });
}