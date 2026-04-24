const API_URL = "https://localhost:7270/api"; // Kendi API portunu kontrol et!

export const getDashboardData = async (token: string) => {
    const response = await fetch(`${API_URL}/Calculations`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error("Veri çekilemedi.");
    return await response.json();
};

export const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return await response.json();
};