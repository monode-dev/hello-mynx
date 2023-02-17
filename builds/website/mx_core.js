// Event
export function Mx_Event() {
  const mySubs = new Set();
  return {
    addSubscriber: (newSub) => mySubs.add(newSub),
    removeSubscriber: (oldSub) => mySubs.delete(oldSub),
    trigger: () => mySubs.forEach((sub) => sub()),
  };
}
export function mx_doOnChange({ actionToDo, triggers }) {
  triggers.forEach((trigger) => trigger?.addSubscriber(actionToDo));
  actionToDo();
}

// Unique Member Key
let _mx_prevUniqueKeyIndex = -1;
export function mx_generateUniqueMemberKey() {
  _mx_prevUniqueKeyIndex++;
  return `mx_k${_mx_prevUniqueKeyIndex}`;
}

// Var
export const Mx_Var = {
  fromFuncs: ({ mx_read, mx_onChange, mx_write }) =>
    new Proxy(
      // Var Obj
      {
        mx_read: mx_read,
        mx_onChange: mx_onChange,
        mx_write: mx_write,
        mx_doOnChange: (actionToDo) => {
          mx_doOnChange({
            actionToDo: actionToDo,
            triggers: [mx_onChange],
          });
        },
      },
      // Var Proxy
      {
        get(varMetadata, memberKey, receiver) {
          if (Object.keys(varMetadata).includes(memberKey)) {
            return varMetadata?.[memberKey];
          } else {
            return Mx_Var.memberRef(
              () => varMetadata.mx_read()?.[memberKey],
              [varMetadata.mx_onChange],
            );
          }
        },

        ownKeys: (_) => {
          return Object.keys(mx_read());
        },
      },
    ),
  ofVal: (initVal) => {
    // Expr should handle lit / reative instead.
    //let myVal = mx_wantLit(initVal);
    let myVal = initVal;
    const mx_onChange = Mx_Event();
    return Mx_Var.fromFuncs({
      mx_read: () => myVal,
      mx_onChange: mx_onChange,
      mx_write: (newVal) => {
        myVal = newVal;
        mx_onChange.trigger();
      },
    });
  },
  memberRef: (getMemberVar, triggers) => {
    let memberInst;
    const mx_onChange = Mx_Event();
    mx_doOnChange({
      actionToDo: () => {
        const newMember = getMemberVar();
        // We init this to the new value, but will attempt to assign the old value later
        let oldMemberValue = mx_wantLit(newMember);
        if (memberInst !== undefined) {
          memberInst?.mx_onChange?.removeSubscriber(mx_onChange.trigger);
          oldMemberValue = mx_wantLit(memberInst);
        }
        memberInst = newMember;
        memberInst?.mx_onChange?.addSubscriber(mx_onChange.trigger);
        if (mx_wantLit(memberInst) != oldMemberValue) {
          mx_onChange.trigger();
        }
      },
      triggers: triggers,
    });
    return Mx_Var.fromFuncs({
      mx_read: () => mx_wantLit(memberInst),
      mx_write: (newVal) => memberInst?.mx_write?.(newVal),
      mx_onChange: mx_onChange,
    });
  },
};

export function mx_getTypeName(obj) {
  switch (typeof obj) {
    case `boolean`:
      return `Bool`;
    case `number`:
      return `Num`;
    case `string`:
      return `Text`;
    default:
      return obj?.mx_type;
  }
}

export function mx_is(obj, typeName) {
  // Flesh out this list at compile time
  const assignableTypes = {
    Bool: [`Bool`],
    Num: [`Num`],
    Text: [`Text`],
  };
  return assignableTypes[typeName].includes(mx_getTypeName(obj));
}

export function mx_to(obj, typeName) {
  // Flesh out this list at compile time
  const converters = {
    Bool: {
      Text: (obj) => obj.toString(),
    },
    Num: {
      Text: (obj) => obj.toString(),
    },
    Text: {},
  };
  return converters[typeName][mx_getTypeName(obj)]?.(obj) ?? obj;
}

export function mx_wantLit(obj) {
  return obj?.mx_read === undefined ? obj : obj.mx_read();
}

export function mx_wantVar(obj) {
  return obj?.mx_read === undefined ? Mx_Var.ofVal(obj) : obj;
}

export function mx_isReactive(x) {
  return x?.mx_onChange !== undefined;
}

export function mx_expr(params, compute) {
  let cachedVal;
  let haveCachedVal = false;
  var mx_onChange = Mx_Event();
  let tryUpdateCachedVal = () => {
    try {
      let newVal = compute(params.map((param) => mx_wantLit(param)));
      if (haveCachedVal && newVal === cachedVal) {
        return;
      }
      cachedVal = newVal;
      if (haveCachedVal) {
        mx_onChange.trigger();
      }
      haveCachedVal = true;
    } catch (e) { }
  };
  params.forEach((param) =>
    param?.mx_onChange?.addSubscriber?.(tryUpdateCachedVal),
  );
  return Mx_Var.fromFuncs({
    mx_write: () => { },
    mx_read: () => {
      // Lazy load the cached value
      if (!haveCachedVal) {
        tryUpdateCachedVal();
      }
      return cachedVal;
    },
    mx_onChange: mx_onChange,
  });
}

export function mx_watchWrite(value, write) {
  mx_doOnChange({
    actionToDo: () => write(mx_wantLit(value)),
    triggers: [value?.mx_onChange],
  });
}

export function mx_variantOf(obj, modifications) {
  return new Proxy(
    {},
    {
      //getPrototypeOf: (target) => getObj()ect.getPrototypeOf(target),
      // ToDo: Implement reactivity for this one
      //setPrototypeOf: (target, proto) => getObj()ect.setPrototypeOf(target, proto),
      //isExtensible: (target) => getObj()ect.isExtensible(target),
      //preventExtensions: (target) => getObj()ect.preventExtensions(target),
      getOwnPropertyDescriptor: (target, prop) => {
        if (prop in modifications) {
          return Object.getOwnPropertyDescriptor(modifications, prop);
        } else if (prop in obj) {
          return Object.getOwnPropertyDescriptor(obj, prop);
        } else {
          return undefined;
        }
      },
      //defineProperty: (target, prop, descriptor) => getObj()ect.defineProperty(target, prop, descriptor),
      has: (_, key) => key in obj || key in modifications,
      get: (_, key) => {
        const prop = key in modifications ? modifications[key] : obj[key];
        /** TODO: Bind is probably broken here. */
        return typeof prop === "function" ? prop.bind(obj) : prop;
      },
      set: (_, key, value) => {
        if (key in modifications) {
          modifications[key] = value;
          return true;
        } else if (key in obj) {
          obj[key] = value;
          return true;
        } else {
          return false;
        }
      },
      deleteProperty: (target, key) => {
        if (key in modifications) {
          delete modifications[key];
          return true;
        } else if (key in obj) {
          delete obj[key];
          return true;
        } else {
          return false;
        }
      },
      ownKeys: (_) => {
        const keys = new Set([
          ...Object.keys(obj),
          ...Object.keys(modifications),
        ]);
        return [...keys];
      },
      // ToDo: Implement reactivity for this one
      //apply: (target, thisArg, argumentsList) => target.apply(thisArg, argumentsList),
      // ToDo: Implement reactivity for this one
      //construct: (target, argumentsList, newTarget) => new target(...argumentsList),
    },
  );
}

export function miwi_mountHtml(params) {
  let child = document.createElement(`div`);
  params.child.role?.mx_doOnChange(() => {
    child.role = mx_wantLit(params.child?.role) ?? ``;
  });
  for (let key of Object.keys(mx_wantLit(params.child.style))) {
    params.child.style[key]?.mx_doOnChange(() => {
      child.style[key] = mx_wantLit(params.child.style[key]) ?? ``;
    });
  }
  params.parent.appendChild(child);
}

export function print(params) {
  console.log(mx_wantLit(Object.values(params)[0]));
}

export function watchPrint(params) {
  const val = Object.values(params)[0];
  mx_doOnChange({
    actionToDo: () => {
      console.log(mx_wantLit(val));
    },
    triggers: [val?.mx_onChange],
  });
}
