import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';


declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute
  ) {
    this.trackPageViews();
  }

  private trackPageViews() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route?.data ?? []),
    ).subscribe((data) => {
      const pageTitle = data['title'] || this.titleService.getTitle();
      const pagePath = this.router.url;

      gtag('event', 'page_view', {
        page_title: pageTitle,
        page_path: pagePath
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
