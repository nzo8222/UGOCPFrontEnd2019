import { Injectable } from '@angular/core';
import { SessionModel } from '../interfaces/DTO';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // LocalStorage value names
    private sessionKey = 'session';

    private subjectLogin = new Subject<any>();
    private subjectLogout = new Subject<any>();

    constructor(private router: Router) { }

    public getLoginObservable(): Observable<any> {
        return this.subjectLogin.asObservable();
    }

    public getLogoutObservable(): Observable<any> {
        return this.subjectLogout.asObservable();
    }

    public navigateHome() {
        this.router.navigate(['/dashboard']);
    }

    public navigateLogin() {
        this.router.navigate(['/home']);
    }

    public setSession(session: SessionModel) {

        const sessionParsed = JSON.stringify(session);
        // Sets session model
        localStorage.setItem(this.sessionKey, sessionParsed);

        // Navigates to home
        this.navigateHome();
    }

    public clearSession() {
        // Clears session
        localStorage.clear();

        // Logout event
        this.subjectLogout.next(null);
    }

    public isAuthenticated(): boolean {
        if (!this.getSession()) { return false; }
        return true;
    }

    public getSession(): SessionModel {
        const sessionParsed = localStorage.getItem(this.sessionKey);
        if (!sessionParsed) { return null; }
        return JSON.parse(sessionParsed);
    }

    public getToken(): string {
        const model = this.getSession();
        return model ? model.jwtToken : '';
    }
    public getUserId(): string {
        const model = this.getSession();
        return model ? model.userId : '';
    }

    public getEmail(): string {
        const model = this.getSession();
        return model ? model.email : '';
    }

    public getExpiration(): number {
        const model = this.getSession();
        return model ? model.expiresIn : 0;
    }

    public getRole(): string {
        const model = this.getSession();
        return model ? model.role : 'customer';
    }
}
