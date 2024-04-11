import '@testing-library/jest-dom'
import {render, screen} from "@testing-library/react";
import Page from "@/app/page";

describe('Example test', () => {
    it('Should ensure page title', () => {
        const {container} = render(<Page/>)
        const element = container.querySelector('p');
        expect(element).toBeInTheDocument()
        expect(2+3).toBe(3);
    })
})