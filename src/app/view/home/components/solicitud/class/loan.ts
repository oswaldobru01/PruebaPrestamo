import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

export class Loan {
    new() : FormGroup{
        return new FormBuilder().group({
            valorSolicitado: new FormControl(null,[Validators.max(100000), Validators.min(10000),Validators.required]),
            fechaPagar: new FormControl('')
        })
    }
}
