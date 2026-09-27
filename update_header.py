with open('src/components/portfolio/PortfolioHeader.tsx', 'r') as f:
    code = f.read()

# 1. Change Hablemos link from TransitionLink to a tag with mailto
old_hablemos = '''<TransitionLink href={lang === 'en' ? '/en/contact' : '/es/contacto'} className="font-medium text-sm text-white pointer-events-auto cursor-pointer hover:opacity-75 transition-opacity block">
          {lang === 'en' ? "Let's talk" : 'Hablemos'}
        </TransitionLink>'''
new_hablemos = '''<a href="mailto:contmanuel77@gmail.com" className="font-medium text-sm text-white pointer-events-auto cursor-pointer hover:opacity-75 transition-opacity block">
          {lang === 'en' ? "Let's talk" : 'Hablemos'}
        </a>'''
code = code.replace(old_hablemos, new_hablemos)

# 2. Remove Contacto from nav
old_nav_contact = '''<TransitionLink href={lang === 'en' ? '/en/contact' : '/es/contacto'} className="hover:text-gray-500 transition-colors">{lang === 'en' ? 'Contact' : 'Contacto'}</TransitionLink>'''
code = code.replace(old_nav_contact + '\n', '')

# 3. Add LinkedIn to the bottom section
old_copy_items = '''<CopyItem value="+525610168992" label="+52 56 1016 8992" copiedText={lang === 'en' ? 'Copied' : 'Copiado'} />
        </div>'''
new_copy_items = '''<CopyItem value="+525610168992" label="+52 56 1016 8992" copiedText={lang === 'en' ? 'Copied' : 'Copiado'} />
          <a href="https://www.linkedin.com/in/manuel-herrera-perfil/" target="_blank" rel="noopener noreferrer" className="text-left text-base font-normal text-gray-600 hover:text-gray-900 transition-colors w-fit pt-1 flex items-center gap-2">
            LinkedIn
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 opacity-50">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </a>
        </div>'''
code = code.replace(old_copy_items, new_copy_items)

with open('src/components/portfolio/PortfolioHeader.tsx', 'w') as f:
    f.write(code)
