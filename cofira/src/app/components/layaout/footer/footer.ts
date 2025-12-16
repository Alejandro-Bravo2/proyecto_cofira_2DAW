import {Component} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class Footer {
  currentYear = new Date().getFullYear();

  socialLinks = [
    {name: 'YouTube', url: 'https://youtube.com/@cofira', icon: 'youtube'},
    {name: 'Facebook', url: 'https://facebook.com/cofira', icon: 'facebook'},
    {name: 'Twitter', url: 'https://twitter.com/cofira', icon: 'twitter'},
    {name: 'Instagram', url: 'https://instagram.com/cofira', icon: 'instagram'},
    {name: 'LinkedIn', url: 'https://linkedin.com/company/cofira', icon: 'linkedin'}
  ];
}
