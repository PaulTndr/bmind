import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-admin-gate',
  templateUrl: './admin-gate.component.html',
  styleUrls: ['./admin-gate.component.scss']
})
export class AdminGateComponent implements OnInit {

  login : String;
  mdp : String;

  constructor(private router: Router, private globalService : GlobalService) { }

  ngOnInit() {
  }

  logIn(){
    if (this.login === "janeB" && this.mdp ==="testJane"){
      this.globalService.isAuth=true;
      this.router.navigate(['/admin/pannel/blogModeration']);
    } else{
      alert('wrong password or login')
    }
  }

}