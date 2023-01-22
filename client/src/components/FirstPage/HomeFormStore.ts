import { ControlsCollection, FormControl, FormGroup, notEmptyOrSpacesValidator, requiredValidator } from "@quantumart/mobx-form-validation-kit";
import { action, makeObservable } from "mobx";

interface HomeForm extends ControlsCollection {
    username: FormControl<string>;
}

class HomeFormStore {
    public form: FormGroup<HomeForm>;

    constructor() {
        makeObservable(this, {
            setUsernameValue: action,
        })
        this.form = new FormGroup<HomeForm>({
            username: new FormControl<string>("", {
                validators: [notEmptyOrSpacesValidator()],
            }),
        });
    }

    setUsernameValue(newValue: string) {
        this.form.controls.username.value = newValue;
    }
}

export default HomeFormStore;