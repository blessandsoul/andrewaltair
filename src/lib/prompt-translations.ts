export const categoryTranslations: Record<string, string> = {
    "Art": "ხელოვნება",
    "Photography": "ფოტოგრაფია",
    "Digital Art": "ციფრული ხელოვნება",
    "3D": "3D",
    "3D Model": "3D მოდელი",
    "Anime": "ანიმე",
    "Logo": "ლოგო",
    "Texture": "ტექსტურა",
    "Web Design": "ვებ დიზაინი",
    "Fashion": "მოდა",
    "Portrait": "პორტრეტი",
    "Landscape": "პეიზაჟი",
    "Architecture": "არქიტექტურა",
    "Cyberpunk": "კიბერპანკი",
    "Fantasy": "ფენტეზი",
    "Sci-Fi": "სამეცნიერო ფანტასტიკა",
    "Realistic": "რეალისტური",
    "Abstract": "აბსტრაქტული",
    "Nature": "ბუნება",
    "Animals": "ცხოველები",
    "Character": "პერსონაჟი",
    "Vehicle": "ტრანსპორტი",
    "Food": "საკვები",
    "Concept Art": "კონცეპტ არტი",
    "Illustration": "ილუსტრაცია",
    "Background": "ფონი",
    "Pattern": "პატერნი",
    "Icon": "იკონი",
    "Vector": "ვექტორი",
    "Typography": "ტიპოგრაფია",
    "Game Asset": "თამაშის ასეტი",
    "Pixel Art": "პიქსელ არტი"
}

export const translateCategory = (cat: string) => {
    if (!cat) return ''
    // Direct lookup
    if (categoryTranslations[cat]) return categoryTranslations[cat]

    // Case insensitive lookup
    const lowerCat = cat.toLowerCase()
    const key = Object.keys(categoryTranslations).find(k => k.toLowerCase() === lowerCat)
    if (key) return categoryTranslations[key]

    return cat
}
