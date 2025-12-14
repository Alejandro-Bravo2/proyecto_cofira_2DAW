import {Component} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  socialLinks = [
    {name: 'YouTube', url: 'https://youtube.com/@cofira', icon: 'youtube'},
    {name: 'Facebook', url: 'https://facebook.com/cofira', icon: 'facebook'},
    {name: 'Twitter', url: 'https://twitter.com/cofira', icon: 'twitter'},
    {name: 'Instagram', url: 'https://instagram.com/cofira', icon: 'instagram'},
    {name: 'LinkedIn', url: 'https://linkedin.com/company/cofira', icon: 'linkedin'}
  ];
}
