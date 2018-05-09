import { Component, OnInit, ViewChild, PipeTransform, Pipe } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import {MatPaginator, MatTableDataSource, MatDialog, MatChipInputEvent} from '@angular/material';
import { Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { FormControl } from '@angular/forms';
import {ENTER, COMMA} from '@angular/cdk/keycodes';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
  countryColumns = ['names', 'confidence', 'isoCode', 'name'];
  cityColumns = [
    'names',
    'confidence',
    'isoCode',
    'subdivisionIsoCode',
    'subdivisionConfidence',
    'subdivisionName',
    'cityName',
    'cityConfidence',
    'postalCode',
    'postalConfidence',
    'latitude',
    'longitude',
    'accuracyRadius',
    'name',
];
  dataSource = new MatTableDataSource<Country>([]);
  country: Country;
  city: City;
  objectKeys = [];
  cityKeys = [];
  dataSource2 = new MatTableDataSource<City>([]);
  IP_ADDRESS = new FormControl();
  isLoading = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  ips = [];


  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  constructor(public router: Router, private http: Http, private dialog: MatDialog) {}
    ngOnInit() {
    }
    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.ips.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(ip: any): void {
    const index = this.ips.indexOf(ip);

    if (index >= 0) {
      this.ips.splice(index, 1);
    }
  }
    getCountryByIps() {
        const vm = this;
        vm.isLoading = true;
        this.http.post('http://localhost:8080/countryiplookup/', {ips: this.ips})
        .map((response) => response.json())
        .subscribe((res) => {
          vm.dataSource.data = res;
          vm.paginator.length = res.length;
          vm.isLoading = false;
        });
    }
    getCityByIps() {
        const vm = this;
        vm.isLoading = true;
        this.http.post('http://localhost:8080/cityiplookup/', {ips: this.ips})
        .map((response) => response.json())
        .subscribe((res) => {
          vm.dataSource2.data = res;
          vm.paginator.length = res.length;
          vm.isLoading = false;
        });
    }
    getCountryByIP() {
        const vm = this;
        vm.isLoading = true;
        this.http.get('http://localhost:8080/countryiplookup/' + vm.IP_ADDRESS.value)
        .map((response) => response.json())
        .subscribe((res) => {
            vm.country = res;
            vm.objectKeys = Object.keys(vm.country);
          vm.isLoading = false;
        });
    }
    getCityByIp() {
        const vm = this;
        vm.isLoading = true;
        this.http.get('http://localhost:8080/cityiplookup/' + vm.IP_ADDRESS.value)
        .map((response) => response.json())
        .subscribe((res) => {
            vm.city = res;
            vm.cityKeys = Object.keys(vm.city);
          vm.isLoading = false;
        });
    }
}

export interface City {
    names: object;
    confidence: number;
    isoCode:  string;
    subdivisionIsoCode:  string;
    subdivisionConfidence: number;
    subdivisionName:  string;
    cityName:  string;
    cityConfidence: number;
    postalCode: string;
    postalConfidence: number;
    latitude: number;
    longitude: number;
    accuracyRadius: number;
    name:  string;
}
export interface Country {
confidence: number;
isoCode: string;
name: string;
names: string;
}

