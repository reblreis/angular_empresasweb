import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  endpoint: string = 'http://localhost:8085/api/empresas';
  empresas: any[] = [];
  empresa: any = {
    idEmpresa: 0,
    nomeFantasia: '',
    razaoSocial: '',
    cnpj: '',
    dataHoraCadastro: new Date()
  };

  constructor(
    private httpClient: HttpClient
  ) {

  }

  //formulário para a janela modal de cadastro
  formCadastro = new FormGroup({
    nomeFantasia: new FormControl('', [Validators.required]),
    razaoSocial: new FormControl('', [Validators.required]),
    cnpj: new FormControl('', [Validators.required])
  });

  get form(): any {
    return this.formCadastro.controls;
  }

  //formulário para a janela modal de edição
  formEdicao = new FormGroup({
    idEmpresa: new FormControl('', [Validators.required]),
    nomeFantasia: new FormControl('', [Validators.required]),
    razaoSocial: new FormControl('', [Validators.required]),
    cnpj: new FormControl('', [Validators.required])
  });

  get formEdit(): any {
    return this.formEdicao.controls;
  }

  //função executada quando a página é aberta
  ngOnInit(): void {
    this.httpClient.get(this.endpoint)
      .subscribe({
        next: (data) => {
          this.empresas = data as any[];
        },
        error: (e) => {
          console.log(e);
        }
      });
  }

  //função executada pelo botão SUBMIT do formulário de cadastro
  onSubmit(): void {
    this.httpClient.post(this.endpoint, this.formCadastro.value)
      .subscribe({
        next: (data: any) => { //capturando o retorno de sucesso da API
          alert(`Empresa '${data.nomeFantasia}', cadastrada com sucesso!`);
          this.formCadastro.reset(); //limpar o formulário
          this.ngOnInit(); //recarregar a consulta
        },
        error: (e) => { //capturando o retorno de erro da API
          alert('Ocorreram erros de validação no preenchimento dos campos.');
          console.log(e.error);
        }
      });
  }

  //função para capturar os dados da empresa para exclusão
  onDelete(item: any): void {
    //capturar os dados da empresa
    this.empresa.idEmpresa = item.idEmpresa;
    this.empresa.nomeFantasia = item.nomeFantasia;
    this.empresa.razaoSocial = item.razaoSocial;
    this.empresa.cnpj = item.cnpj;
    this.empresa.dataHoraCadastro = item.dataHoraCadastro;
  }

  //função para capturar os dados da empresa para edição
  onUpdate(item: any): void {
    //preencher o formulário com os dados da empresa
    this.formEdicao.patchValue(item);
  }

  //função para confirmar a operação de exclusão da empresa
  onDeleteConfirm(): void {
    this.httpClient.delete(this.endpoint + "/" + this.empresa.idEmpresa)
      .subscribe({
        next: (data: any) => {
          alert(`Empresa '${data.nomeFantasia}', excluída com sucesso.`);
          this.ngOnInit(); //executando a consulta de empresas
        },
        error: (e) => {
          console.log(e.error);
        }
      })
  }

  //função para atualizar os dados da empresa
  onUpdateConfirm(): void {
    this.httpClient.put(this.endpoint, this.formEdicao.value)
      .subscribe({
        next: (data: any) => {
          alert(`Empresa '${data.nomeFantasia}', atualizada com sucesso!`);
          this.ngOnInit();
        },
        error: (e) => {
          console.log(e.error);
        }
      })
  }

}