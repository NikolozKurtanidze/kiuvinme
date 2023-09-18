import { action, makeObservable, observable } from "mobx";

class HomeFormStore {
  usernameValue: string;

  constructor(username?: string) {
    this.usernameValue = username ?? "";

    makeObservable(this, {
      usernameValue: observable,
      setUsernameValue: action,
    });
  }

  setUsernameValue(newValue: string) {
    this.usernameValue = newValue;
  }
}

export default HomeFormStore;
