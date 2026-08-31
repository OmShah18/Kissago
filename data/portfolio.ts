/** The 54 frames of the portfolio grid, in the order they are laid out.
 *  Each id resolves to a 900px grid file and a 1200px `-lg` lightbox file. */

export type PortfolioCategory = 'weddings' | 'couples' | 'bridal' | 'celebration' | 'details';

export interface PortfolioFrame {
    id: string;
    cat: PortfolioCategory;
}

export const PORTFOLIO_FILTERS = [
    { filter: 'all', label: 'Everything' },
    { filter: 'weddings', label: 'Weddings' },
    { filter: 'couples', label: 'Couples' },
    { filter: 'bridal', label: 'Portraits' },
    { filter: 'celebration', label: 'Celebration' },
    { filter: 'details', label: 'Details' },
] as const;

export const PORTFOLIO: PortfolioFrame[] = [
    { id: 'p01', cat: 'couples' },
    { id: 'p02', cat: 'couples' },
    { id: 'p03', cat: 'bridal' },
    { id: 'p04', cat: 'weddings' },
    { id: 'p05', cat: 'weddings' },
    { id: 'p06', cat: 'details' },
    { id: 'p07', cat: 'couples' },
    { id: 'p08', cat: 'bridal' },
    { id: 'p09', cat: 'couples' },
    { id: 'p10', cat: 'bridal' },
    { id: 'p11', cat: 'weddings' },
    { id: 'p12', cat: 'bridal' },
    { id: 'p13', cat: 'couples' },
    { id: 'p14', cat: 'bridal' },
    { id: 'p15', cat: 'weddings' },
    { id: 'p16', cat: 'details' },
    { id: 'p17', cat: 'couples' },
    { id: 'p18', cat: 'bridal' },
    { id: 'p19', cat: 'couples' },
    { id: 'p20', cat: 'bridal' },
    { id: 'p21', cat: 'weddings' },
    { id: 'p22', cat: 'weddings' },
    { id: 'p23', cat: 'weddings' },
    { id: 'p24', cat: 'celebration' },
    { id: 'p25', cat: 'couples' },
    { id: 'p26', cat: 'couples' },
    { id: 'p27', cat: 'couples' },
    { id: 'p28', cat: 'weddings' },
    { id: 'p29', cat: 'couples' },
    { id: 'p30', cat: 'couples' },
    { id: 'p31', cat: 'couples' },
    { id: 'p32', cat: 'weddings' },
    { id: 'p33', cat: 'weddings' },
    { id: 'p34', cat: 'details' },
    { id: 'p35', cat: 'couples' },
    { id: 'p36', cat: 'details' },
    { id: 'p37', cat: 'couples' },
    { id: 'p38', cat: 'celebration' },
    { id: 'p39', cat: 'weddings' },
    { id: 'p40', cat: 'couples' },
    { id: 'p41', cat: 'couples' },
    { id: 'p42', cat: 'bridal' },
    { id: 'p43', cat: 'couples' },
    { id: 'p44', cat: 'weddings' },
    { id: 'p45', cat: 'details' },
    { id: 'p46', cat: 'bridal' },
    { id: 'p47', cat: 'couples' },
    { id: 'p48', cat: 'celebration' },
    { id: 'p49', cat: 'couples' },
    { id: 'p50', cat: 'couples' },
    { id: 'p51', cat: 'weddings' },
    { id: 'p52', cat: 'couples' },
    { id: 'p53', cat: 'weddings' },
    { id: 'p54', cat: 'couples' },
];
