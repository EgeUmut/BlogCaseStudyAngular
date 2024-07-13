import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { NgModel } from "@angular/forms";


@NgModule({
    declarations:[],
    exports:[NgModel],
    imports:[CKEditorModule,NgModule],

})
export class SharedModule{}