import {Component, OnInit} from '@angular/core';
import {OktaAuthService} from '@okta/okta-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated = false;
  userFullName: string;

  // storage: Storage = localStorage;
  storage: Storage = sessionStorage;

  constructor(private oktaAuthService: OktaAuthService) { }

  ngOnInit(): void {
    // Subscribe to auth state change
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated = result;
        this.getUserDetails();
      }
    );
  }

  // tslint:disable-next-line:typedef
  private getUserDetails() {
    if (this.isAuthenticated) {
      this.oktaAuthService.getUser().then(
        (res) => {
          this.userFullName = res.name;

          // retrieve the user's email from authentication response
          const theEmail = res.email;

          // store in browser
          this.storage.setItem('userEmail', JSON.stringify(theEmail));
        }
      );
    }
  }

  // tslint:disable-next-line:typedef
  logout() {
    this.oktaAuthService.signOut();
    this.storage.clear();
  }
}
