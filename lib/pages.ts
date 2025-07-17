import fs from "fs"
import path from "path"

export interface PageData {
  id: string
  name: string
  description: string
  powerBIUrl?: string
  spreadsheetUrl?: string
  category?: string
}

const pagesFilePath = path.join(process.cwd(), "data", "pages.json")

export function readPages(): PageData[] {
  try {
    const fileContent = fs.readFileSync(pagesFilePath, "utf-8")
    return JSON.parse(fileContent) || []
  } catch (err) {
    console.error("Failed to read pages.json:", err)
    return []
  }
}

export function savePages(pages: PageData[]): void {
  try {
    fs.writeFileSync(pagesFilePath, JSON.stringify(pages, null, 2))
  } catch (err) {
    console.error("Failed to write pages.json:", err)
  }
}

export function addPage(newPage: PageData): void {
  const pages = readPages()
  pages.push(newPage)
  savePages(pages)
}

export function deletePage(id: string): void {
  const pages = readPages()
  const updatedPages = pages.filter((page) => page.id !== id)
  savePages(updatedPages)
}

export function getPage(id: string): PageData | undefined {
  return readPages().find((page) => page.id === id)
}

export function updatePage(updated: PageData): void {
  const pages = readPages().map((page) =>
    page.id === updated.id ? updated : page
  )
  savePages(pages)
}
