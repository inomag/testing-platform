// This  notifier function has been modified through from default notifier present in wdr.

const diffTypes = {
  different: 'different',
  deepEquals: 'deepEquals',
  date: 'date',
  regex: 'regex',
  reactElement: 'reactElement',
  function: 'function',
  same: 'same',
};
const diffTypesDescriptions = {
  [diffTypes.different]: 'different objects',
  [diffTypes.deepEquals]: 'different objects that are equal by value',
  [diffTypes.date]: 'different date objects with the same value',
  [diffTypes.regex]: 'different regular expressions with the same value',
  [diffTypes.reactElement]:
    'different React elements (remember that the <jsx/> syntax always produces a *NEW* immutable React element so a component that receives <jsx/> as props always re-renders)',
  [diffTypes.function]: 'different functions with the same name',
  [diffTypes.same]: 'same objects by ref (===)',
};

const titleColor = '#a62c2b';
const diffNameColor = '#a62c2b';
const diffPathColor = '#a62c2b';
const moreInfoUrl = 'http://bit.ly/wdyr02';
const moreInfoHooksUrl = 'http://bit.ly/wdyr3';

export const resultRerenderData = {};

function shouldLog(reason) {
  const hasDifferentValues =
    (reason.propsDifferences &&
      reason.propsDifferences.some(
        (diff) => diff.diffType === diffTypes.different,
      )) ||
    (reason.stateDifferences &&
      reason.stateDifferences.some(
        (diff) => diff.diffType === diffTypes.different,
      )) ||
    (reason.hookDifferences &&
      reason.hookDifferences.some(
        (diff) => diff.diffType === diffTypes.different,
      ));

  return !hasDifferentValues;
}

function logDifference({
  Component,
  displayName,
  hookName,
  prefixMessage,
  diffObjType,
  differences,
  values,
}) {
  if (differences && differences.length > 0) {
    console.log(
      { [displayName]: Component },
      `${prefixMessage} of ${diffObjType} changes:`,
    );
    differences.forEach(({ pathString, diffType, prevValue, nextValue }) => {
      console.group(
        `%c${
          diffObjType === 'hook'
            ? `[hook ${hookName} result]`
            : `${diffObjType}.`
        }%c${pathString}%c`,
        `color:${diffNameColor};`,
        `color:${diffPathColor};`,
        'color:default;',
      );
      console.log(
        `${diffTypesDescriptions[diffType]}. (more info at ${
          hookName ? moreInfoHooksUrl : moreInfoUrl
        })`,
      );
      console.log({ [`prev ${pathString}`]: prevValue }, '!==', {
        [`next ${pathString}`]: nextValue,
      });
      console.groupEnd();
    });
  } else if (differences) {
    console.log(
      { [displayName]: Component },
      `${prefixMessage} the ${diffObjType} object itself changed but its values are all equal.`,
      diffObjType === 'props'
        ? 'This could have been avoided by making the component pure, or by preventing its father from re-rendering.'
        : 'This usually means this component called setState when no changes in its state actually occurred.',
      `More info at ${moreInfoUrl}`,
    );
    console.log(
      `prev ${diffObjType}:`,
      values.prev,
      ' !== ',
      values.next,
      `:next ${diffObjType}`,
    );
  }
}

export default function defaultNotifier(updateInfo) {
  const {
    Component,
    displayName,
    hookName,
    prevProps,
    prevState,
    prevHook,
    nextProps,
    nextState,
    nextHook,
    reason,
  } = updateInfo;

  if (!shouldLog(reason)) {
    return;
  }

  console.group(`%c${displayName}`, `color: ${titleColor}`);

  let prefixMessage = 'Re-rendered because';

  if (reason.propsDifferences) {
    logDifference({
      Component,
      displayName,
      prefixMessage,
      diffObjType: 'props',
      differences: reason.propsDifferences,
      values: { prev: prevProps, next: nextProps },
    });
    prefixMessage = 'And because';
  }

  if (reason.stateDifferences) {
    logDifference({
      Component,
      displayName,
      prefixMessage,
      diffObjType: 'state',
      differences: reason.stateDifferences,
      values: { prev: prevState, next: nextState },
    });
  }

  if (reason.hookDifferences) {
    logDifference({
      Component,
      displayName,
      prefixMessage,
      diffObjType: 'hook',
      differences: reason.hookDifferences,
      values: { prev: prevHook, next: nextHook },
      hookName,
    });
  }

  //   TODO once basic component rerenders are eleminated then we can focus on renredner of child through parents rerender
  //   if (reason.propsDifferences && reason.ownerDifferences) {
  //     }
  //     console.groupEnd();
  //   }

  if (
    !reason.propsDifferences &&
    !reason.stateDifferences &&
    !reason.hookDifferences
  ) {
    console.log(
      { [displayName]: Component },
      'Re-rendered although props and state objects are the same.',
      'This usually means there was a call to this.forceUpdate() inside the component.',
      `more info at ${moreInfoUrl}`,
    );
  }

  console.groupEnd();
}
