export { useTreeView } from './useTreeView';
export { TreeViewProvider, useTreeViewContext } from './TreeViewProvider';

export { RichTreeViewItems } from './components/RichTreeViewItems';
export type {
  RichTreeViewItemsSlots,
  RichTreeViewItemsSlotProps,
} from './components/RichTreeViewItems';

export {
  unstable_resetCleanupTracking,
  useInstanceEventHandler,
} from './hooks/useInstanceEventHandler';
export { useSelector } from './hooks/useSelector';

export type {
  TreeViewPlugin,
  TreeViewPluginSignature,
  ConvertPluginsIntoSignatures,
  MergeSignaturesProperty,
  TreeViewPublicAPI,
  TreeViewState,
  TreeViewItemMeta,
  TreeViewInstance,
  TreeViewItemPlugin,
  TreeViewUsedStore,
} from './models';

// Core plugins
export type { TreeViewCorePluginParameters } from './corePlugins';

// Plugins
export { useTreeViewExpansion } from './plugins/useTreeViewExpansion';
export type {
  UseTreeViewExpansionSignature,
  UseTreeViewExpansionParameters,
} from './plugins/useTreeViewExpansion';
export { useTreeViewSelection } from './plugins/useTreeViewSelection';
export type {
  UseTreeViewSelectionSignature,
  UseTreeViewSelectionParameters,
} from './plugins/useTreeViewSelection';
export { useTreeViewFocus } from './plugins/useTreeViewFocus';
export type {
  UseTreeViewFocusSignature,
  UseTreeViewFocusParameters,
} from './plugins/useTreeViewFocus';
export { useTreeViewKeyboardNavigation } from './plugins/useTreeViewKeyboardNavigation';
export type { UseTreeViewKeyboardNavigationSignature } from './plugins/useTreeViewKeyboardNavigation';
export {
  useTreeViewItems,
  buildSiblingIndexes,
  TREE_VIEW_ROOT_PARENT_ID,
} from './plugins/useTreeViewItems';
export {
  selectorItemMetaLookup,
  selectorItemMeta,
  selectorItemIndex,
  selectorItemOrderedChildrenIds,
} from './plugins/useTreeViewItems/useTreeViewItems.selectors';
export type {
  UseTreeViewItemsSignature,
  UseTreeViewItemsParameters,
  UseTreeViewItemsState,
} from './plugins/useTreeViewItems';
export { useTreeViewLabel } from './plugins/useTreeViewLabel';
export {
  selectorIsItemBeingEdited,
  selectorIsAnyItemBeingEdited,
} from './plugins/useTreeViewLabel/useTreeViewLabel.selectors';
export type {
  UseTreeViewLabelSignature,
  UseTreeViewLabelParameters,
} from './plugins/useTreeViewLabel';
export { selectorIsItemExpanded } from './plugins/useTreeViewExpansion/useTreeViewExpansion.selectors';
export { selectorIsItemSelected } from './plugins/useTreeViewSelection/useTreeViewSelection.selectors';
export {
  selectorDataSourceState,
  selectorGetTreeItemError,
} from './plugins/useTreeViewLazyLoading/useTreeViewLazyLoading.selectors';
export type { UseTreeViewLazyLoadingSignature } from './plugins/useTreeViewLazyLoading';
export type { UseTreeViewLazyLoadingParameters } from './plugins/useTreeViewLazyLoading';
export { useTreeViewJSXItems } from './plugins/useTreeViewJSXItems';
export type {
  UseTreeViewJSXItemsSignature,
  UseTreeViewJSXItemsParameters,
} from './plugins/useTreeViewJSXItems';

export { createSelector } from './utils/selectors';
export { isTargetInDescendants } from './utils/tree';
export { TreeViewStore } from './utils/TreeViewStore';

export type {
  TreeViewClasses,
  TreeViewSlots,
  TreeViewSlotProps,
} from './TreeViewProvider/TreeViewStyleContext';
