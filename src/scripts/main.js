import 'wicg-inert'
import { mobileNavigation } from '../components/blocks/mobile-navigation/mobileNavigation.js'
import { catalogMenu } from '../components/blocks/catalog-menu/catalogMenu.js'
import { myModal } from '../components/features/modal/modal.js'

mobileNavigation('.burger', '#mobile-nav')
mobileNavigation('.catalog-menu__trigger', '#category-nav')
catalogMenu()
