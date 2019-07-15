import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RespuestaServidor } from '../interfaces/response';
import {LoginDTO, RegistroUsuarioDTO } from '../interfaces/DTO';


class HttpRequestUtil {
    constructor(private http: HttpClient, public urlService: string) {}
  
    public doGet<T>(url: string): Observable<T> {
      const fullUrl = this.urlService + url;
  
      return this.http
        .get<T>(fullUrl, {
          headers: new HttpHeaders({
            'Access-Control-Allow-Origin': ['*']
          })
        })
        .pipe(
          map(result => {
            return result;
          }),
          catchError(ex => {
            // TODO: Agregar lógica para manejo de errores
            throw ex;
          })
        );
    }
  
    public doPost<T>(url: string, data: any): Observable<T> {
      const fullUrl = this.urlService + url;
  
      return this.http
        .post<T>(fullUrl, data, {
          headers: new HttpHeaders({
            'Access-Control-Allow-Origin': ['*']
          })
        })
        .pipe(
          map(result => {
            if (result) {
              return result;
            }
          }),
          catchError(ex => {
            // TODO: Agregar lógica para manejo de errores
            throw ex;
          })
        );
    }
  
    public doDelete<T>(url: string): Observable<T> {
      const fullUrl = this.urlService + url;
  
      return this.http
        .delete<T>(fullUrl, {
          headers: new HttpHeaders({
            'Access-Control-Allow-Origin': ['*']
          })
        })
        .pipe(
          map(result => {
            if (result) {
              return result;
            }
          }),
          catchError(ex => {
            // TODO: Agregar lógica para manejo de errores
            throw ex;
          })
        );
    }
  }

  @Injectable()
export class FacadeService {
  private request: HttpRequestUtil;

  constructor(http: HttpClient) {
    const urlService = environment.API_URL;
    this.request = new HttpRequestUtil(http, urlService);
  } 
  
  public Login(loginDTO: LoginDTO): Observable<RespuestaServidor>{
    return this.request.doPost<RespuestaServidor>(`Login/Login`, loginDTO);
  }
  public RegistroUsuario(RegistroUsuario : RegistroUsuarioDTO): Observable<RespuestaServidor>{
    return this.request.doPost<RespuestaServidor>(`Login/Registro`, RegistroUsuario);
  }

}