const Menu = [
  { path: 'dashboard', icon: 'fa fa-sitemap', title: 'Dashboard',
    children: [
      { path: '/dashboard/v1', title: 'Dashboard v1' },
      { path: '/dashboard/v2', title: 'Dashboard v2' },
      { path: '/dashboard/v3', title: 'Dashboard v3' },    
    ]
  },
  { path: '/users', icon: 'fa fa-user', title: 'Gestion de usuarios',
    children: [
      { path: '/users/pages', title: 'Usuarios' },
      { path: '/roles/pages', title: 'Roles' }, 
      { path: '/oficinas/pages', title: 'Oficinas' }     
    ]
  },  
  { path: '/ui', icon: 'fa fa-gem', title: 'UI Elements', label: 'NEW',
    children: [
      { path: '/ui/general', title: 'General', highlight: true },
      { path: '/ui/typography', title: 'Typograhy' },
      { path: '/ui/tabs-accordion', title: 'Tabs & Accordion' },
      { path: '/ui/modal-notification', title: 'Modal & Notification' },
      { path: '/ui/widget-boxes', title: 'Widget Boxes' },
      { path: '/ui/media-object', title: 'Media Object' },
      { path: '/ui/buttons', title: 'Buttons', highlight: true },
      { path: '/ui/icon-duotone', title: 'Duotone Icons', highlight: true },
      { path: '/ui/icon-fontawesome', title: 'FontAwesome' },
      { path: '/ui/icon-bootstrap', title: 'Bootstrap Icons', highlight: true },
      { path: '/ui/icon-simple-line-icons', title: 'Simple Line Icons' },
      { path: '/ui/language-bar-icon', title: 'Language Bar & Icon' },
      { path: '/ui/social-buttons', title: 'Social Buttons' }
    ]
  },
  { path: '/form', icon: 'fa fa-list-ol', title: 'Form Stuff', label: 'NEW',
    children: [
      { path: '/form/elements', title: 'Form Elements', highlight: true },
      { path: '/form/plugins', title: 'Form Plugins', highlight: true },
      { path: '/form/wizards', title: 'Form Wizards', highlight: true }
    ]
  },
  { path: '/table', icon: 'fa fa-table', title: 'Tables',
    children: [
      { path: '/table/elements', title: 'Table Elements' },
      { path: '/table/plugins', title: 'Table Plugins' }
    ]
  }, 
]

export default Menu;