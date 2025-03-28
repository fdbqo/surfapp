import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.sendPageView(event.urlAfterRedirects);
    });
  }

  sendPageView(url: string) {
    gtag('event', 'page_view', {
      page_path: url
    });
  }

  sendEvent(eventName: string, params?: { [key: string]: any }) {
    gtag('event', eventName, params || {});
  }


  setUserProperties(properties: { [key: string]: any }) {
    gtag('set', 'user_properties', properties);
  }

  setUserId(userId: string) {
    gtag('config', 'G-XXXXXXXXXX', {
      user_id: userId
    });
  }
}
