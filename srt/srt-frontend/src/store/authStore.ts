// small non-react store used by axios interceptor to get token synchronously
let token: string | null = null;
let user: { id: number; username: string; email: string; role: string } | null = null;

export function setAuthState(tkn: string | null, u: any | null): void {
	token = tkn;
	user = u;
	if (tkn) localStorage.setItem('srt_token', tkn);
	else localStorage.removeItem('srt_token');
	if (u) localStorage.setItem('srt_user', JSON.stringify(u));
	else localStorage.removeItem('srt_user');
}

export function getAuthState() {
	if (!token) token = localStorage.getItem('srt_token');
	if (!user) {
		const s = localStorage.getItem('srt_user');
		user = s ? JSON.parse(s) : null;
	}
	return { token, user };
}

export function logout() {
	return setAuthState(null, null);
}