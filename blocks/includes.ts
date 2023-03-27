export default async function resolveIncludes(content: string, files: { [key: string]: { path: string, url: string } }): Promise<string[]> {
    const lines = content.split('\n')
    return Promise.all(lines.map(async (line) => {
        if (line.startsWith('include::')) {
            const found = line.match('include::(.+)\\[]')
            if (found) {
                const target = found[1];
                const file = files[target]
                if (file) {
                    const response = await fetch(file.url)
                    const data = await response.json()
                    return atob(data.content)
                }
            }
        }
        return line
    }));
}