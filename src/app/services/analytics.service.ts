import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private router: Router) {
    this.trackPageViews();
  }

  private trackPageViews() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      gtag('event', 'page_view', {
        page_path: event.urlAfterRedirects
      });
    });
  }

  sendEvent(eventName: string, params?: { [key: string]: any }) {
    gtag('event', eventName, params || {});
  }

  trackCommentPosted(type: 'comment' | 'reply', spotId: string) {
    this.sendEvent('comment_posted', {
      type,
      spot_id: spotId
    });
  }

  trackCommentEdited(commentId: string, spotId: string) {
    this.sendEvent('comment_edited', {
      comment_id: commentId,
      spot_id: spotId
    });
  }

  trackCommentDeleted(commentId: string, spotId: string) {
    this.sendEvent('comment_deleted', {
      comment_id: commentId,
      spot_id: spotId
    });
  }
}
