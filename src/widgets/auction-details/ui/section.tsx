import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'

type SectionProps = {
  title: string
  children: React.ReactNode
}

export function Section({
  title,
  children,
}: SectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="flex flex-col gap-2 text-sm">{children}</dl>
      </CardContent>
    </Card>
  )
}
