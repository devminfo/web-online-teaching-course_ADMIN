import { Injectable, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SEOModel } from 'core/model/request/seo/seo_model';
import { CommonService } from 'core/utils/common.service';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class SeoService implements OnDestroy {
  destroy$ = new Subject();
  appTitle = 'FiveSS';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    private commonService: CommonService,
  ) {}

  init(): void {
    this.appTitle = this.titleService.getTitle();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.getLatestChild().snapshot.data || {}),
        takeUntil(this.destroy$),
      )
      .subscribe(({ title, description, robots }) => {
        this.setTitle(this.appTitle, title);
        this.setDescription(description);
        this.setRobots(robots);
      });
  }

  private getLatestChild(): ActivatedRoute {
    let child = this.activatedRoute.firstChild as ActivatedRoute;

    while (child.firstChild) {
      child = child.firstChild;
    }

    return child;
  }

  private setTitle(rootTitle: string, title: string): void {
    if (title) {
      this.titleService.setTitle(`${rootTitle} - ${title}`);
    }
  }

  private setDescription(description: string): void {
    if (description) {
      this.metaService.updateTag({
        name: 'description',
        content: description,
      });
    }
  }

  private setRobots(robots: string): void {
    if (robots) {
      this.metaService.updateTag({
        name: 'robots',
        content: robots,
      });
    }
  }

  public setSocialMediaTags(
    title: string,
    image: string,
    url: string,
    description: string,
  ) {
    this.setTitle(this.appTitle, title);

    //set Social Media Google
    let descriptionTemp = this.commonService.stripHtml(description);
    const tagsGoogle: SEOModel[] = [
      {
        name: 'description',
        value: descriptionTemp.slice(0, 200) + '...',
        isFacebook: false,
      },
      { name: 'keywords', value: title, isFacebook: false },
    ];
    this.setTags(tagsGoogle);

    //set Social Media Facebook
    const tagsFacebook: SEOModel[] = [
      {
        name: 'og:title',
        value: title,
        isFacebook: true,
      },
      {
        name: 'og:image',
        value: image,
        isFacebook: true,
      },
      {
        name: 'og:url',
        value: url,
        isFacebook: true,
      },
      {
        name: 'og:description',
        value: descriptionTemp.slice(0, 200) + '...',
        isFacebook: true,
      },
    ];
    this.setTags(tagsFacebook);

    //set Social Media Twitter
    const tagsTwitter: SEOModel[] = [
      {
        name: 'twitter:title',
        value: title,
        isFacebook: false,
      },
      {
        name: 'og:image',
        value: image,
        isFacebook: false,
      },

      {
        name: 'og:description',
        value: descriptionTemp.slice(0, 200) + '...',
        isFacebook: false,
      },
    ];

    this.setTags(tagsTwitter);
  }

  private setTags(tags: SEOModel[] = []): void {
    tags.forEach((siteTag) => {
      if (siteTag.isFacebook) {
        this.metaService.getTag(`property='${siteTag.name}'`);
        this.metaService.updateTag({
          property: siteTag.name,
          content: siteTag.value,
        });
      } else {
        this.metaService.getTag(`name='${siteTag.name}'`);
        this.metaService.updateTag({
          name: siteTag.name,
          content: siteTag.value,
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
