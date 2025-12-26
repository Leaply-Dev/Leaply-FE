import Link from "next/link";

export default function Page() {
	return (
		<div className="page-container">
			<article className="prose prose-lg dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80 max-w-none">
				<h1>Điều khoản sử dụng</h1>
				<p>
					<strong>Cập nhật lần cuối:</strong> 27/12/2025
				</p>
				<hr />
				<h2>1. Giới thiệu và Chấp nhận Điều khoản</h2>
				<p>
					Chào mừng bạn đến với Leaply. Bằng việc truy cập hoặc sử dụng nền tảng
					Leaply (website, ứng dụng và các dịch vụ liên quan), bạn đồng ý tuân
					thủ và bị ràng buộc bởi các Điều khoản Sử dụng này.
				</p>
				<p>
					Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng
					dịch vụ của chúng tôi.
				</p>
				<hr />
				<h2>2. Mô tả Dịch vụ</h2>
				<p>
					Leaply là nền tảng hỗ trợ học sinh, sinh viên Việt Nam trong hành
					trình chuẩn bị du học, bao gồm:
				</p>
				<ul>
					<li>
						<strong>Explore:</strong> Tìm kiếm và so sánh chương trình học phù
						hợp
					</li>
					<li>
						<strong>Persona Lab:</strong> Khám phá bản thân và xây dựng câu
						chuyện cá nhân
					</li>
					<li>
						<strong>Application Dashboard:</strong> Quản lý hồ sơ ứng tuyển và
						viết essay
					</li>
				</ul>
				<hr />
				<h2>3. Điều kiện Sử dụng</h2>
				<h3>3.1 Độ tuổi</h3>
				<p>
					Leaply dành cho người từ <strong>18 tuổi trở lên</strong>.
				</p>
				<p>
					Dịch vụ được thiết kế để hỗ trợ sinh viên đại học và người đi làm
					chuẩn bị hồ sơ cao học (Master&#39;s, MBA, PhD).
				</p>
				<p>Bằng việc đăng ký, bạn xác nhận bạn từ 18 tuổi trở lên.</p>
				<h3>3.2 Tài khoản</h3>
				<ul>
					<li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập</li>
					<li>Mỗi người chỉ được sở hữu một tài khoản</li>
					<li>Bạn phải cung cấp thông tin chính xác và cập nhật</li>
				</ul>
				<h3>3.3 Hành vi được phép</h3>
				<p>Bạn đồng ý:</p>
				<ul>
					<li>Sử dụng dịch vụ cho mục đích cá nhân, hợp pháp</li>
					<li>Cung cấp thông tin trung thực trong hồ sơ</li>
					<li>Tôn trọng quyền sở hữu trí tuệ</li>
				</ul>
				<h3>3.4 Hành vi bị cấm</h3>
				<p>Bạn KHÔNG được:</p>
				<ul>
					<li>Sử dụng Leaply để tạo nội dung gian lận hoặc đạo văn</li>
					<li>Mạo danh người khác</li>
					<li>Cố gắng truy cập trái phép hệ thống</li>
					<li>Sử dụng bot hoặc công cụ tự động để khai thác dữ liệu</li>
					<li>Chia sẻ tài khoản với người khác</li>
					<li>Sử dụng dịch vụ cho mục đích thương mại mà không được phép</li>
				</ul>
				<hr />
				<h2>4. Công nghệ AI và Giới hạn</h2>
				<h3>4.1 Về việc sử dụng AI</h3>
				<p>Leaply sử dụng trí tuệ nhân tạo (AI) để:</p>
				<ul>
					<li>Tính toán Fit Score và gợi ý chương trình</li>
					<li>Hỗ trợ khám phá bản thân qua câu hỏi có định hướng</li>
					<li>Cung cấp feedback cho essay và CV</li>
				</ul>
				<h3>4.2 Giới hạn của AI</h3>
				<p>
					<strong>Quan trọng - Vui lòng đọc kỹ:</strong>
				</p>
				<p>
					Leaply là <strong>công cụ hỗ trợ</strong>, KHÔNG thay thế:
				</p>
				<ul>
					<li>Tư vấn viên du học chuyên nghiệp</li>
					<li>Quyết định tuyển sinh chính thức của các trường</li>
					<li>Đánh giá chính thức về khả năng trúng tuyển</li>
				</ul>
				<p>Fit Score và các gợi ý:</p>
				<ul>
					<li>Được tính toán dựa trên dữ liệu có sẵn</li>
					<li>Có thể không phản ánh đầy đủ tiêu chí tuyển sinh thực tế</li>
					<li>Chỉ mang tính tham khảo, không đảm bảo kết quả</li>
				</ul>
				<p>
					<strong>Chúng tôi không chịu trách nhiệm</strong> cho:
				</p>
				<ul>
					<li>Quyết định tuyển sinh của bất kỳ trường nào</li>
					<li>Kết quả ứng tuyển của bạn</li>
					<li>Thiệt hại phát sinh từ việc dựa hoàn toàn vào gợi ý của AI</li>
				</ul>
				<h3>4.3 Nguyên tắc hỗ trợ viết</h3>
				<p>Leaply hỗ trợ viết essay theo nguyên tắc:</p>
				<ul>
					<li>Cung cấp feedback, gợi ý cải thiện</li>
					<li>KHÔNG viết hộ hoặc tạo nội dung thay bạn</li>
					<li>Giúp bạn giữ giọng văn và câu chuyện riêng</li>
					<li>Bạn hoàn toàn chịu trách nhiệm về nội dung cuối cùng</li>
				</ul>
				<hr />
				<h2>5. Quyền Sở hữu Trí tuệ</h2>
				<h3>5.1 Nội dung của bạn</h3>
				<p>
					Bạn <strong>giữ toàn quyền sở hữu</strong> với:
				</p>
				<ul>
					<li>Essay, SOP và các bài viết bạn tạo</li>
					<li>CV và tài liệu bạn upload</li>
					<li>Thông tin và câu trả lời trong Persona Lab</li>
				</ul>
				<p>Bằng việc sử dụng dịch vụ, bạn cấp cho Leaply quyền:</p>
				<ul>
					<li>Lưu trữ và xử lý nội dung để cung cấp dịch vụ</li>
					<li>Hiển thị nội dung cho bạn trong platform</li>
					<li>Sử dụng dữ liệu ẩn danh để cải thiện AI (có thể từ chối)</li>
				</ul>
				<h3>5.2 Nội dung của Leaply</h3>
				<p>Leaply sở hữu:</p>
				<ul>
					<li>Giao diện, thiết kế, logo</li>
					<li>Thuật toán và mã nguồn</li>
					<li>Nội dung hướng dẫn và tài liệu</li>
					<li>Cơ sở dữ liệu chương trình học</li>
				</ul>
				<p>
					Bạn KHÔNG được sao chép, phân phối hoặc tạo sản phẩm phái sinh từ nội
					dung của Leaply mà không có sự cho phép bằng văn bản.
				</p>
				<hr />
				<h2>6. Thanh toán và Hoàn tiền</h2>
				<h3>6.1 Gói dịch vụ</h3>
				<p>Leaply cung cấp các gói:</p>
				<ul>
					<li>
						<strong>Free:</strong> Tính năng cơ bản, giới hạn sử dụng
					</li>
					<li>
						<strong>Pro:</strong> [Giá]/tháng - Tính năng nâng cao
					</li>
					<li>
						<strong>Premium:</strong> [Giá]/tháng - Đầy đủ tính năng
					</li>
				</ul>
				<h3>6.2 Chính sách thanh toán</h3>
				<ul>
					<li>Thanh toán theo chu kỳ tháng hoặc năm</li>
					<li>Tự động gia hạn trừ khi bạn hủy</li>
					<li>Giá có thể thay đổi với thông báo trước 30 ngày</li>
				</ul>
				<h3>6.3 Chính sách hoàn tiền</h3>
				<p>
					<strong>Leaply KHÔNG hoàn tiền</strong> cho:
				</p>
				<ul>
					<li>Gói đã thanh toán và bắt đầu sử dụng</li>
					<li>Chu kỳ thanh toán đang diễn ra</li>
					<li>Tài khoản bị khóa do vi phạm điều khoản</li>
				</ul>
				<p>
					<strong>Ngoại lệ:</strong>
				</p>
				<ul>
					<li>Lỗi kỹ thuật nghiêm trọng khiến dịch vụ không sử dụng được</li>
					<li>Trường hợp đặc biệt xét theo từng trường hợp</li>
				</ul>
				<p>
					Để yêu cầu xem xét hoàn tiền, liên hệ:{" "}
					<a href="mailto:contact@leaply.ai.vn">contact@leaply.ai.vn</a>
				</p>
				<hr />
				<h2>7. Chấm dứt Dịch vụ</h2>
				<h3>7.1 Bạn có thể hủy tài khoản</h3>
				<ul>
					<li>Bất kỳ lúc nào qua Cài đặt &gt; Xóa tài khoản</li>
					<li>Dữ liệu được lưu giữ 1 năm theo Chính sách Bảo mật</li>
					<li>Gói đã thanh toán không được hoàn tiền</li>
				</ul>
				<h3>7.2 Chúng tôi có thể tạm ngưng hoặc chấm dứt tài khoản</h3>
				<p>Trong trường hợp:</p>
				<ul>
					<li>Vi phạm Điều khoản Sử dụng</li>
					<li>Hoạt động gian lận hoặc bất hợp pháp</li>
					<li>Không thanh toán gói dịch vụ</li>
					<li>Yêu cầu từ cơ quan có thẩm quyền</li>
				</ul>
				<p>
					Chúng tôi sẽ thông báo trước khi chấm dứt, trừ trường hợp khẩn cấp.
				</p>
				<hr />
				<h2>8. Giới hạn Trách nhiệm</h2>
				<h3>8.1 Dịch vụ cung cấp &quot;nguyên trạng&quot;</h3>
				<p>
					Leaply được cung cấp &quot;nguyên trạng&quot; (as is) và &quot;sẵn
					có&quot; (as available). Chúng tôi không đảm bảo:
				</p>
				<ul>
					<li>Dịch vụ hoạt động không gián đoạn</li>
					<li>Thông tin chương trình học luôn chính xác 100%</li>
					<li>Kết quả ứng tuyển cụ thể</li>
				</ul>
				<h3>8.2 Giới hạn bồi thường</h3>
				<p>
					Trong phạm vi pháp luật cho phép, trách nhiệm bồi thường của Leaply
					(nếu có) không vượt quá số tiền bạn đã thanh toán trong 12 tháng gần
					nhất.
				</p>
				<p>Chúng tôi không chịu trách nhiệm cho:</p>
				<ul>
					<li>Thiệt hại gián tiếp, ngẫu nhiên</li>
					<li>Mất dữ liệu do lỗi người dùng</li>
					<li>Hành vi của bên thứ ba</li>
				</ul>
				<hr />
				<h2>9. Beta và Thay đổi Dịch vụ</h2>
				<h3>9.1 Giai đoạn Beta</h3>
				<p>Leaply hiện đang trong giai đoạn beta. Điều này có nghĩa:</p>
				<ul>
					<li>Một số tính năng có thể chưa hoàn thiện</li>
					<li>Có thể có thay đổi đáng kể</li>
					<li>Chúng tôi đánh giá cao phản hồi của bạn</li>
				</ul>
				<h3>9.2 Quyền thay đổi</h3>
				<p>Chúng tôi có quyền:</p>
				<ul>
					<li>Thêm, sửa đổi hoặc loại bỏ tính năng</li>
					<li>Thay đổi giá với thông báo trước 30 ngày</li>
					<li>Tạm ngưng dịch vụ để bảo trì</li>
				</ul>
				<hr />
				<h2>10. Quyền riêng tư</h2>
				<p>
					Việc thu thập và sử dụng thông tin cá nhân được quy định trong{" "}
					<Link href="/privacy">Chính sách Bảo mật</Link> của chúng tôi, là một
					phần không tách rời của Điều khoản Sử dụng này.
				</p>
				<hr />
				<h2>11. Luật áp dụng và Giải quyết Tranh chấp</h2>
				<h3>11.1 Luật áp dụng</h3>
				<p>Điều khoản này được điều chỉnh bởi pháp luật Việt Nam.</p>
				<h3>11.2 Giải quyết tranh chấp</h3>
				<p>Trong trường hợp có tranh chấp:</p>
				<ol>
					<li>
						<strong>Bước 1:</strong> Liên hệ hỗ trợ để giải quyết trực tiếp
					</li>
					<li>
						<strong>Bước 2:</strong> Hòa giải thông qua bên thứ ba
					</li>
					<li>
						<strong>Bước 3:</strong> Giải quyết tại Tòa án có thẩm quyền tại
						Việt Nam
					</li>
				</ol>
				<hr />
				<h2>12. Điều khoản Chung</h2>
				<h3>12.1 Toàn bộ thỏa thuận</h3>
				<p>
					Điều khoản này, cùng với Chính sách Bảo mật, tạo thành toàn bộ thỏa
					thuận giữa bạn và Leaply.
				</p>
				<h3>12.2 Tách rời</h3>
				<p>
					Nếu bất kỳ điều khoản nào bị coi là không hợp lệ, các điều khoản còn
					lại vẫn có hiệu lực.
				</p>
				<h3>12.3 Không từ bỏ quyền</h3>
				<p>
					Việc không thực thi một điều khoản không có nghĩa là từ bỏ quyền thực
					thi trong tương lai.
				</p>
				<h3>12.4 Thay đổi điều khoản</h3>
				<p>
					Chúng tôi có thể cập nhật Điều khoản này. Thay đổi quan trọng sẽ được
					thông báo qua:
				</p>
				<ul>
					<li>Email</li>
					<li>Banner trên website</li>
					<li>Yêu cầu đồng ý lại nếu cần</li>
				</ul>
				<hr />
				<h2>13. Liên hệ</h2>
				<p>Nếu có câu hỏi về Điều khoản Sử dụng:</p>
				<ul>
					<li>
						<strong>Email:</strong>{" "}
						<a href="mailto:contact@leaply.ai.vn">contact@leaply.ai.vn</a>
					</li>
					<li>
						<strong>Địa chỉ:</strong> Hà Nội, Việt Nam
					</li>
				</ul>
				<hr />
				<p>
					Bằng việc sử dụng Leaply, bạn xác nhận đã đọc, hiểu và đồng ý với các
					Điều khoản Sử dụng này.
				</p>
			</article>
		</div>
	);
}
