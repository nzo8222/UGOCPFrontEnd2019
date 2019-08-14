import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { FacadeService } from './shared/services/facade.service';
import { AuthService } from './shared/guard/auth.service';
import { ToastrModule } from 'ngx-toastr';
import { NotificationService } from './shared/services/notification.service';
import { GridModule } from '@progress/kendo-angular-grid';




@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        LanguageTranslationModule,
        AppRoutingModule,
        ToastrModule.forRoot(),
        GridModule
    ],
    declarations: [AppComponent],
    providers: [AuthGuard, FacadeService, AuthService, NotificationService],
    bootstrap: [AppComponent]
})
export class AppModule {}
