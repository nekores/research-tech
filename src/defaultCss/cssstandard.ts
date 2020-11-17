export var surveyCss: any = {
  currentType: "",
  getCss: function () {
    var loc = this.currentType ? this[this.currentType] : defaultStandardCss;
    if (!loc) loc = defaultStandardCss;
    return loc;
  },
};

export var defaultStandardCss = {
  root: "sv_main sv_default_css",
  container: "sv_container",
  header: "sv_header",
  body: "sv_body",
  bodyEmpty: "sv_body sv_body_empty",
  footer: "sv_nav",
  title: "",
  description: "",
  logo: "sv_logo",
  logoImage: "sv_logo__image",
  headerText: "sv_header__text",
  navigationButton: "",
  completedPage: "sv_completed_page",
  navigation: {
    complete: "sv_complete_btn",
    prev: "sv_prev_btn",
    next: "sv_next_btn",
    start: "sv_start_btn",
    preview: "sv_preview_btn",
    edit: "sv_edit_btn",
  },
  progress: "sv_progress",
  progressBar: "sv_progress_bar",
  progressTextInBar: "sv-hidden",
  page: {
    root: "sv_p_root",
    title: "sv_page_title",
    description: "",
  },
  // TODO: move to the page object
  pageTitle: "sv_page_title",
  pageDescription: "",
  row: "sv_row",
  question: {
    mainRoot: "sv_q sv_qstn",
    flowRoot: "sv_q_flow sv_qstn",
    header: "",
    headerLeft: "title-left",
    content: "",
    contentLeft: "content-left",
    titleLeftRoot: "sv_qstn_left",
    requiredText: "sv_q_required_text",
    title: "sv_q_title",
    number: "sv_q_num",
    description: "sv_q_description",
    comment: "",
    required: "",
    titleRequired: "",
    hasError: "",
    indent: 20,
    footer: "sv_q_footer",
    formGroup: "form-group",
    asCell: "sv_matrix_cell",
  },
  panel: {
    title: "sv_p_title",
    titleExpandable: "sv_p_title_expandable",
    titleOnError: "",
    icon: "sv_panel_icon",
    iconExpanded: "sv_expanded",
    description: "sv_p_description",
    container: "sv_p_container",
    footer: "sv_p_footer",
    number: "sv_q_num",
    requiredText: "sv_q_required_text",
  },
  error: {
    root: "sv_q_erbox",
    icon: "",
    item: "",
    locationTop: "sv_qstn_error_top",
    locationBottom: "sv_qstn_error_bottom",
  },

  boolean: {
    root: "sv_qcbc sv_qbln",
    item: "sv-boolean",
    control: "sv-visuallyhidden",
    itemChecked: "sv-boolean--checked checked",
    itemIndeterminate: "sv-boolean--indeterminate",
    itemDisabled: "sv-boolean--disabled",
    switch: "sv-boolean__switch",
    slider: "sv-boolean__slider",
    label: "sv-boolean__label ",
    disabledLabel: "sv-boolean__label--disabled",
    materialDecorator: "sv-item__decorator sv-boolean__decorator ",
    itemDecorator: "sv-item__svg  sv-boolean__svg",
    checkedPath: "sv-boolean__checked-path",
    uncheckedPath: "sv-boolean__unchecked-path",
    indeterminatePath: "sv-boolean__indeterminate-path",
  },
  checkbox: {
    root: "sv_qcbc sv_qcbx",
    item: "sv_q_checkbox",
    itemSelectAll: "sv_q_checkbox_selectall",
    itemNone: "sv_q_checkbox_none",
    itemChecked: "checked",
    itemInline: "sv_q_checkbox_inline",
    label: "sv_q_checkbox_label",
    labelChecked: "",
    itemControl: "sv_q_checkbox_control_item",
    itemDecorator: "sv-hidden",
    controlLabel: "sv_q_checkbox_control_label",
    materialDecorator: "checkbox-material",
    other: "sv_q_other sv_q_checkbox_other",
    column: "sv_q_select_column",
  },
  comment: "",
  dropdown: {
    root: "",
    control: "sv_q_dropdown_control",
    selectWrapper: "sv_select_wrapper",
    other: "sv_q_dd_other",
  },
  html: { root: "" },
  image: { root: "sv_q_image", image: "sv_image_image" },
  matrix: {
    root: "sv_q_matrix",
    label: "sv_q_m_label",
    itemChecked: "checked",
    itemDecorator: "sv-hidden",
    cellText: "sv_q_m_cell_text",
    cellTextSelected: "sv_q_m_cell_selected",
    cellLabel: "sv_q_m_cell_label",
  },
  matrixdropdown: {
    root: "sv_q_matrix_dropdown",
    cell: "sv_matrix_cell",
    headerCell: "sv_matrix_cell_header",
    detailRowText: "sv_matrix_cell_detail_rowtext",
    detailCell: "sv_matrix_cell_detail",
    detailButton: "sv_matrix_cell_detail_button",
    detailButtonExpanded: "sv_matrix_cell_detail_button_expanded",
    detailIcon: "sv_detail_panel_icon",
    detailIconExpanded: "sv_detail_expanded",
    detailPanelCell: "sv_matrix_cell_detail_panel",
  },
  matrixdynamic: {
    root: "sv_q_matrix_dynamic",
    button: "sv_matrix_dynamic_button",
    buttonAdd: "",
    buttonRemove: "",
    iconAdd: "",
    iconRemove: "",
    cell: "sv_matrix_cell",
    headerCell: "sv_matrix_cell_header",
    detailCell: "sv_matrix_cell_detail",
    detailButton: "sv_matrix_cell_detail_button",
    detailButtonExpanded: "sv_matrix_cell_detail_button_expanded",
    detailIcon: "sv_detail_panel_icon",
    detailIconExpanded: "sv_detail_expanded",
    detailPanelCell: "sv_matrix_cell_detail_panel",
  },
  paneldynamic: {
    root: "sv_panel_dynamic",
    title: "sv_p_title",
    button: "",
    buttonAdd: "sv-paneldynamic__add-btn",
    buttonRemove: "",
    buttonPrev: "sv-paneldynamic__prev-btn",
    buttonNext: "sv-paneldynamic__next-btn",
    progressContainer: "sv-paneldynamic__progress-container",
    progress: "sv-progress",
    progressBar: "sv-progress__bar",
    progressText: "sv-paneldynamic__progress-text",
  },
  multipletext: {
    root: "sv_q_mt",
    itemTitle: "sv_q_mt_title",
    row: "sv_q_mt_row",
    itemValue: "sv_q_mt_item_value sv_q_text_root",
  },
  radiogroup: {
    root: "sv_qcbc",
    item: "sv_q_radiogroup",
    itemChecked: "checked",
    itemInline: "sv_q_radiogroup_inline",
    itemDecorator: "sv-hidden",
    label: "sv_q_radiogroup_label",
    labelChecked: "",
    itemControl: "sv_q_radiogroup_control_item",
    controlLabel: "",
    materialDecorator: "circle",
    other: "sv_q_other sv_q_radiogroup_other",
    clearButton: "sv_q_radiogroup_clear",
    column: "sv_q_select_column",
  },
  imagepicker: {
    root: "sv_imgsel",
    item: "sv_q_imgsel",
    itemChecked: "checked",
    label: "sv_q_imgsel_label",
    itemControl: "sv_q_imgsel_control_item",
    image: "sv_q_imgsel_image",
    itemInline: "sv_q_imagepicker_inline",
    itemText: "sv_q_imgsel_text",
    clearButton: "sv_q_radiogroup_clear",
  },
  rating: {
    root: "sv_q_rating",
    item: "sv_q_rating_item",
    selected: "active",
    minText: "sv_q_rating_min_text",
    itemText: "sv_q_rating_item_text",
    maxText: "sv_q_rating_max_text",
    disabled: "",
  },
  text: "sv_q_text_root",
  expression: "",
  file: {
    root: "sv_q_file",
    placeholderInput: "sv-visuallyhidden",
    preview: "sv_q_file_preview",
    removeButton: "sv_q_file_remove_button",
    fileInput: "sv-visuallyhidden",
    removeFile: "sv_q_file_remove",
    removeFileSvg: "sv-hidden",
    fileDecorator: "sv-file__decorator",
    fileSignBottom: "sv-hidden",
    removeButtonBottom: "sv-hidden",
    chooseFile: "sv_q_file_choose_button",
    noFileChosen: "sv_q_file_placeholder",
  },
  signaturepad: {
    root: "sv_q_signaturepad sjs_sp_container",
    controls: "sjs_sp_controls",
    clearButton: "sjs_sp_clear",
  },
  saveData: {
    root: "",
    saving: "",
    error: "",
    success: "",
    saveAgainButton: "",
  },
  window: {
    root: "sv_window",
    body: "sv_window_content",
    header: {
      root: "sv_window_title",
      title: "",
      button: "",
      buttonExpanded: "",
      buttonCollapsed: "",
    },
  },
};

surveyCss["standard"] = defaultStandardCss;
