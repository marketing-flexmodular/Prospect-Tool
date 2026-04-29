

// Removed Revenue Estimation Logic as per request.
// This file is kept minimal if future utils are needed.

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0
    }).format(value);
};

// Python logic reference for user request
export const PYTHON_LOGIC_DOCS = `
# Backend Logic (Python/FastAPI)
import requests
from bs4 import BeautifulSoup

def enrich_company_data(cnpj: str):
    # 1. Fetch Basic Data
    # 2. OSINT / Scraping (Google Maps)
    website = google_search_company(company_name) 
    
    # 3. Scrape Website for contacts
    extra_data = {}
    if website:
        extra_data = scrape_contacts(website)
    
    return {
        "website": website,
        "scraped_contacts": extra_data
    }

def scrape_contacts(url):
    try:
        page = requests.get(url, timeout=5)
        soup = BeautifulSoup(page.content, 'html.parser')
        
        phones = set(re.findall(r'\(?\d{2}\)?\s?\d{4,5}-?\d{4}', soup.text))
        emails = set(re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', soup.text))
        
        return {"phones": list(phones), "emails": list(emails)}
    except:
        return {}
`;
