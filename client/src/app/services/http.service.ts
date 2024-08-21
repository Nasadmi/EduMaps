import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from 'dotenv';
import { type MarkmapsHome } from '../../types/markmaps';

config();

const server = process.env['SERVER_URL'];

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private readonly http: HttpClient) {}

  getAllMarkmaps() {
    return this.http.get<MarkmapsHome[]>(server + '/markmaps/all', {
      responseType: 'json',
    });
  }
}
