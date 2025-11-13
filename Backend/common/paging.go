package common

type Paging struct {
	Page   int
	Limit  int
	Offset int
}

func (p *Paging) Process() {
	if p.Limit <= 0 {
		p.Limit = 10
	}
	if p.Page <= 0 {
		p.Page = 1
	}
	p.Offset = (p.Page - 1) * p.Limit
}
